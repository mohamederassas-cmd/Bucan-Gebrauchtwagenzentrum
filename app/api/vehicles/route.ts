import { NextRequest, NextResponse } from "next/server";
import { createVehicle, getAllVehicles } from "@/lib/vehicles";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  const vehicles = getAllVehicles();
  return NextResponse.json(vehicles);
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  const body = await req.json();
  const vehicle = createVehicle(body);
  return NextResponse.json(vehicle, { status: 201 });
}
