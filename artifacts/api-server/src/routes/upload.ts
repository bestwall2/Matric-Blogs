import { Router, type IRouter } from "express";
import multer from "multer";
import { createServiceSupabase } from "../lib/supabase";
import { adminAuth } from "../middleware/adminAuth";

const router: IRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post(
  "/upload",
  adminAuth,
  upload.single("file"),
  async (req, res): Promise<void> => {
    if (!req.file) {
      res.status(400).json({ error: "Missing file" });
      return;
    }

    const ext =
      req.file.originalname.split(".").pop()?.replace(/[^\w]/g, "") || "jpg";
    const path = `featured/${crypto.randomUUID()}.${ext}`;

    try {
      const supabase = createServiceSupabase();
      const { data, error } = await supabase.storage
        .from("featured")
        .upload(path, req.file.buffer, {
          contentType: req.file.mimetype || "image/jpeg",
          upsert: false,
        });

      if (error) {
        req.log.error({ error }, "upload storage error");
        res.status(500).json({ error: error.message });
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("featured").getPublicUrl(data.path);

      res.json({ url: publicUrl });
    } catch (e) {
      req.log.error({ e }, "upload exception");
      res.status(500).json({ error: "Upload failed" });
    }
  }
);

export default router;
