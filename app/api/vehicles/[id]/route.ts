import { NextRequest, NextResponse } from "next/server";
import { getVehicleById, updateVehicle, deleteVehicle } from "@/lib/vehicles";
import { isAuthenticated } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vehicle = getVehicleById(id);
  if (!vehicle) return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
  return NextResponse.json(vehicle);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();
  const vehicle = updateVehicle(id, body);
  if (!vehicle) return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
  return NextResponse.json(vehicle);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();
  const vehicle = updateVehicle(id, body);
  if (!vehicle) return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
  return NextResponse.json(vehicle);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }
  const { id } = await params;
  const ok = deleteVehicle(id);
  if (!ok) return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
