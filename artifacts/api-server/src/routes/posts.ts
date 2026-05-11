import { Router, type IRouter } from "express";
import {
  ListPostsResponse,
  GetFeaturedPostsResponse,
  GetPostsStatsResponse,
  ListAdminPostsResponse,
  GetPostBySlugResponse,
  GetPostBySlugParams,
  GetPostByIdResponse,
  GetPostByIdParams,
  UpdatePostParams,
  UpdatePostBody,
  UpdatePostResponse,
  DeletePostParams,
  CreatePostBody,
  IncrementPostViewBody,
  IncrementPostViewResponse,
  ListPostsQueryParams,
  GetFeaturedPostsQueryParams,
} from "@workspace/api-zod";
import { createServiceSupabase, publicPostsOrFilter } from "../lib/supabase";
import { adminAuth } from "../middleware/adminAuth";

const router: IRouter = Router();

const POST_SELECT = `*,categories:category_id (*),authors:author_id (*)`;

router.get("/posts", async (req, res): Promise<void> => {
  try {
    const qp = ListPostsQueryParams.safeParse(req.query);
    const page = qp.success ? (qp.data.page ?? 1) : 1;
    const pageSize = qp.success ? (qp.data.pageSize ?? 12) : 12;
    const categorySlug = qp.success ? qp.data.categorySlug : undefined;
    const sort = qp.success ? (qp.data.sort ?? "latest") : "latest";

    const supabase = createServiceSupabase();
    let q = supabase
      .from("posts")
      .select(POST_SELECT, { count: "exact" })
      .or(publicPostsOrFilter());

    if (categorySlug) {
      const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", categorySlug)
        .maybeSingle();
      if (cat?.id) {
        q = q.eq("category_id", cat.id);
      }
    }

    if (sort === "views") {
      q = q.order("view_count", { ascending: false });
    } else {
      q = q.order("published_at", { ascending: false });
    }

    const from = (page - 1) * pageSize;
    q = q.range(from, from + pageSize - 1);

    const { data, count, error } = await q;
    if (error) {
      req.log.error({ error }, "listPosts error");
      res.status(500).json({ error: error.message });
      return;
    }

    res.json(
      ListPostsResponse.parse({ posts: data ?? [], total: count ?? 0 })
    );
  } catch (e) {
    req.log.error({ e }, "listPosts exception");
    res.status(500).json({ error: "Internal error" });
  }
});

router.get("/posts/featured", async (req, res): Promise<void> => {
  try {
    const qp = GetFeaturedPostsQueryParams.safeParse(req.query);
    const limit = qp.success ? (qp.data.limit ?? 13) : 13;

    const supabase = createServiceSupabase();
    const { data, error } = await supabase
      .from("posts")
      .select(POST_SELECT)
      .or(publicPostsOrFilter())
      .order("published_at", { ascending: false })
      .limit(limit);

    if (error) {
      req.log.error({ error }, "getFeaturedPosts error");
      res.status(500).json({ error: error.message });
      return;
    }

    res.json(GetFeaturedPostsResponse.parse(data ?? []));
  } catch (e) {
    req.log.error({ e }, "getFeaturedPosts exception");
    res.status(500).json({ error: "Internal error" });
  }
});

router.get("/posts/stats", async (_req, res): Promise<void> => {
  try {
    const supabase = createServiceSupabase();
    const now = new Date().toISOString();

    const [postsRes, catsRes, viewsRes] = await Promise.all([
      supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .or(
          `and(status.eq.published,published_at.lte.${now}),and(status.eq.scheduled,scheduled_at.lte.${now})`
        ),
      supabase
        .from("categories")
        .select("*", { count: "exact", head: true }),
      supabase.from("posts").select("view_count").or(
        `and(status.eq.published,published_at.lte.${now}),and(status.eq.scheduled,scheduled_at.lte.${now})`
      ),
    ]);

    const totalViews = (viewsRes.data ?? []).reduce(
      (sum: number, p: { view_count: number | null }) =>
        sum + (p.view_count ?? 0),
      0
    );

    res.json(
      GetPostsStatsResponse.parse({
        articles: postsRes.count ?? 0,
        categories: catsRes.count ?? 0,
        views: totalViews,
      })
    );
  } catch (e) {
    res.status(500).json({ error: "Internal error" });
  }
});

router.get("/posts/admin", adminAuth, async (_req, res): Promise<void> => {
  try {
    const supabase = createServiceSupabase();
    const { data, error } = await supabase
      .from("posts")
      .select(POST_SELECT)
      .order("created_at", { ascending: false });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json(ListAdminPostsResponse.parse(data ?? []));
  } catch (e) {
    res.status(500).json({ error: "Internal error" });
  }
});

router.get("/posts/slug/:slug", async (req, res): Promise<void> => {
  const params = GetPostBySlugParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid slug" });
    return;
  }

  const supabase = createServiceSupabase();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("slug", params.data.slug)
    .or(publicPostsOrFilter())
    .maybeSingle();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  if (!data) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  res.json(GetPostBySlugResponse.parse(data));
});

router.get("/posts/id/:id", adminAuth, async (req, res): Promise<void> => {
  const params = GetPostByIdParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const supabase = createServiceSupabase();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("id", params.data.id)
    .maybeSingle();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  if (!data) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  res.json(GetPostByIdResponse.parse(data));
});

router.post("/posts/create", adminAuth, async (req, res): Promise<void> => {
  const body = CreatePostBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const supabase = createServiceSupabase();
  const { data, error } = await supabase
    .from("posts")
    .insert(body.data)
    .select(POST_SELECT)
    .single();

  if (error) {
    req.log.error({ error }, "createPost error");
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(201).json(data);
});

router.post("/posts/view", async (req, res): Promise<void> => {
  const body = IncrementPostViewBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const supabase = createServiceSupabase();

  const { error: rpcError } = await supabase.rpc("increment_view_count", {
    p_slug: body.data.slug,
  });

  if (rpcError) {
    const { data: post, error: fetchError } = await supabase
      .from("posts")
      .select("id, view_count")
      .eq("slug", body.data.slug)
      .maybeSingle();

    if (fetchError || !post) {
      req.log.error({ rpcError, fetchError }, "incrementView: post not found");
      res.status(404).json({ error: "Post not found" });
      return;
    }

    const { error: updateError } = await supabase
      .from("posts")
      .update({ view_count: (post.view_count ?? 0) + 1 })
      .eq("id", post.id);

    if (updateError) {
      req.log.error({ updateError }, "incrementView: update failed");
      res.status(500).json({ error: "Failed to increment view count" });
      return;
    }
  }

  res.json(IncrementPostViewResponse.parse({ ok: true }));
});

router.patch("/posts/:id", adminAuth, async (req, res): Promise<void> => {
  const params = UpdatePostParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const body = UpdatePostBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const supabase = createServiceSupabase();
  const { data, error } = await supabase
    .from("posts")
    .update({ ...body.data, updated_at: new Date().toISOString() })
    .eq("id", params.data.id)
    .select(POST_SELECT)
    .single();

  if (error) {
    req.log.error({ error }, "updatePost error");
    res.status(500).json({ error: error.message });
    return;
  }

  res.json(UpdatePostResponse.parse(data));
});

router.delete("/posts/:id", adminAuth, async (req, res): Promise<void> => {
  const params = DeletePostParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const supabase = createServiceSupabase();
  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", params.data.id);

  if (error) {
    req.log.error({ error }, "deletePost error");
    res.status(500).json({ error: error.message });
    return;
  }

  res.sendStatus(204);
});

export default router;
