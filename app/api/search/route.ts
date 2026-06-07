import { NextResponse } from "next/server";
import YTMusic from "ytmusic-api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json(
      { success: false, error: "Mau cari lagu apa bung? Masukkan parameter \"q\"." }, 
      { status: 400 }
    );
  }

  try {
    const ytmusic = new YTMusic();
    await ytmusic.initialize();

    // Cari lagu berdasarkan query
    const songs = await ytmusic.searchSongs(query);

    // Transform the response to match expected format
    const transformedSongs = songs.map((song) => ({
      videoId: song.videoId,
      name: song.name,
      artists: song.artist ? [{ name: song.artist.name, artistId: song.artist.artistId }] : [],
      artist: song.artist ? {
        name: song.artist.name,
        artistId: song.artist.artistId
      } : null,
      album: song.album ? {
        name: song.album.name,
        albumId: song.album.albumId
      } : null,
      duration: song.duration,
      thumbnails: song.thumbnails || [],
      type: song.type
    }));

    // Kita ambil 10 teratas aja biar responnya cepat
    return NextResponse.json({ success: true, data: transformedSongs.slice(0, 10) });
  } catch (error: any) {
    console.error("YTMusic API Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data dari YT Music." }, 
      { status: 500 }
    );
  }
}
