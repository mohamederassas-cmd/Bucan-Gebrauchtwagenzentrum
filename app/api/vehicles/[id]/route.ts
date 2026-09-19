import { NextRequest, NextResponse } from "next/server";
import { getVehicleById, updateVehicle, deleteVehicle } from "@/lib/vehicles";
import { isAuthenticated } from "@/lib/auth";
import { validateVehicle, validateVehiclePatch, ValidationError } from "@/lib/validation";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

function handleError(err: unknown, action: string) {
  if (err instanceof ValidationError) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
  console.error(`${action} fehlgeschlagen:`, err);
  return NextResponse.json(
    { error: "Änderung konnte nicht gespeichert werden. Bitte später erneut versuchen." },
    { status: 500 }
  );
}

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const vehicle = await getVehicleById(id);
  if (!vehicle) return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
  return NextResponse.json(vehicle);
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const data = validateVehicle(await req.json());
    const vehicle = await updateVehicle(id, data);
    if (!vehicle) return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
    return NextResponse.json(vehicle);
  } catch (err) {
    return handleError(err, "PUT /api/vehicles/[id]");
  }
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const data = validateVehiclePatch(await req.json());
    const vehicle = await updateVehicle(id, data);
    if (!vehicle) return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
    return NextResponse.json(vehicle);
  } catch (err) {
    return handleError(err, "PATCH /api/vehicles/[id]");
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const ok = await deleteVehicle(id);
    if (!ok) return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleError(err, "DELETE /api/vehicles/[id]");
  }
}
