import { Router, type IRouter } from "express";
import {
  ListCategoriesResponse,
  CreateCategoryBody,
} from "@workspace/api-zod";
import { createServiceSupabase } from "../lib/supabase";
import { adminAuth } from "../middleware/adminAuth";

const router: IRouter = Router();

router.get("/categories", async (_req, res): Promise<void> => {
  const supabase = createServiceSupabase();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json(ListCategoriesResponse.parse(data ?? []));
});

router.post("/categories", adminAuth, async (req, res): Promise<void> => {
  const body = CreateCategoryBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const supabase = createServiceSupabase();
  const { data, error } = await supabase
    .from("categories")
    .insert(body.data)
    .select("*")
    .single();

  if (error) {
    req.log.error({ error }, "createCategory error");
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(201).json(data);
});

export default router;
