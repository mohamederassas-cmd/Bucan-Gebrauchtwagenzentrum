import { NextRequest, NextResponse } from "next/server";
import { createVehicle, getAllVehicles } from "@/lib/vehicles";
import { isAuthenticated } from "@/lib/auth";
import { validateVehicle, ValidationError } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET() {
  const vehicles = await getAllVehicles();
  return NextResponse.json(vehicles);
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = validateVehicle(body);
    const vehicle = await createVehicle(data);
    return NextResponse.json(vehicle, { status: 201 });
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("POST /api/vehicles fehlgeschlagen:", err);
    return NextResponse.json(
      { error: "Fahrzeug konnte nicht gespeichert werden. Bitte später erneut versuchen." },
      { status: 500 }
    );
  }
}
