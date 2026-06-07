import { NextResponse } from "next/server";
import { db, auth } from "@/lib/config";
import { collection, addDoc, deleteDoc, doc, query, where, getDocs, serverTimestamp } from "firebase/firestore";

// GET - Fetch user's favorites
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    const favoritesRef = collection(db, "favorites");
    const q = query(favoritesRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const favorites: any[] = [];
    querySnapshot.forEach((doc) => {
      favorites.push({ id: doc.id, ...doc.data() });
    });

    return NextResponse.json({ success: true, data: favorites });
  } catch (error: any) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch favorites" },
      { status: 500 }
    );
  }
}

// POST - Add to favorites
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, track } = body;

    if (!userId || !track) {
      return NextResponse.json(
        { success: false, error: "User ID and track are required" },
        { status: 400 }
      );
    }

    // Check if already favorited
    const favoritesRef = collection(db, "favorites");
    const q = query(
      favoritesRef,
      where("userId", "==", userId),
      where("videoId", "==", track.videoId)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return NextResponse.json(
        { success: false, error: "Track already in favorites" },
        { status: 400 }
      );
    }

    // Add to favorites
    const docRef = await addDoc(favoritesRef, {
      userId,
      videoId: track.videoId,
      name: track.name,
      artist: track.artist,
      artists: track.artists || [],
      album: track.album,
      thumbnails: track.thumbnails || [],
      duration: track.duration || null,
      addedAt: serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      data: { id: docRef.id, message: "Added to favorites" },
    });
  } catch (error: any) {
    console.error("Error adding to favorites:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add to favorites" },
      { status: 500 }
    );
  }
}

// DELETE - Remove from favorites
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const videoId = searchParams.get("videoId");

    if (!userId || !videoId) {
      return NextResponse.json(
        { success: false, error: "User ID and video ID are required" },
        { status: 400 }
      );
    }

    // Find and delete the favorite
    const favoritesRef = collection(db, "favorites");
    const q = query(
      favoritesRef,
      where("userId", "==", userId),
      where("videoId", "==", videoId)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json(
        { success: false, error: "Favorite not found" },
        { status: 404 }
      );
    }

    // Delete all matching documents (should be only one)
    const deletePromises = querySnapshot.docs.map((document) =>
      deleteDoc(doc(db, "favorites", document.id))
    );
    await Promise.all(deletePromises);

    return NextResponse.json({
      success: true,
      data: { message: "Removed from favorites" },
    });
  } catch (error: any) {
    console.error("Error removing from favorites:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove from favorites" },
      { status: 500 }
    );
  }
}
