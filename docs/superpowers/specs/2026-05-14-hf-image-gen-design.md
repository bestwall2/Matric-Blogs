# Hugging Face Image Generation Integration Design

## Overview
This design details the replacement of the existing Gemini image generation with the Hugging Face Inference API directly within the API route, maintaining current frontend compatibility by returning base64-encoded image data.

## Architecture
- **API Route**: The `src/app/api/generate-image/route.ts` will be updated to directly call the Hugging Face Inference API.

## API Specification
- **Endpoint**: `POST /api/generate-image`
- **Request Body**: `{ "prompt": string }`
- **Response**: `{ "image": "data:image/png;base64,..." }`

## Configuration
- `HF_TOKEN` must be set in the environment variables.

## Error Handling
- Capture and log Hugging Face API errors.
- Return standard HTTP 500/400 errors to the client.
