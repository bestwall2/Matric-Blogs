import { Router, type IRouter } from "express";
import { SubscribeNewsletterBody, SubscribeNewsletterResponse } from "@workspace/api-zod";
import { createServiceSupabase } from "../lib/supabase";

const router: IRouter = Router();

router.post("/newsletter", async (req, res): Promise<void> => {
  const body = SubscribeNewsletterBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const supabase = createServiceSupabase();

  const { data: existing } = await supabase
    .from("newsletter_subscribers")
    .select("id")
    .eq("email", body.data.email)
    .maybeSingle();

  if (existing) {
    res.json(SubscribeNewsletterResponse.parse({ ok: true, duplicate: true }));
    return;
  }

  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email: body.data.email });

  if (error) {
    req.log.error({ error }, "newsletter subscribe error");
    res.status(500).json({ error: error.message });
    return;
  }

  res.json(SubscribeNewsletterResponse.parse({ ok: true, duplicate: false }));
});

export default router;
