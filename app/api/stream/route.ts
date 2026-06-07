import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get("videoId");

  if (!videoId) {
    return NextResponse.json(
      { success: false, error: "Video ID is required" },
      { status: 400 }
    );
  }

  try {
    // Combine videoId with YouTube watch URL
    // YouTube Music watch URLs work with HTML5 Audio
    const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
    
    return NextResponse.json({
      success: true,
      streamUrl: watchUrl,
      videoId,
    });
  } catch (error: any) {
    console.error("Stream API Error:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Failed to generate stream URL",
      },
      { status: 500 }
    );
  }
}
