export async function writeSchema(schema: string) {
  const res = await fetch("http://localhost:3476/v1/tenants/t1/schemas/write", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ schema }),
  });
  const data = await res.text();

  if (!res.ok) {
    throw new Error(`Permify error: ${res.status} - ${data}`);
  }

  console.log("Permify schema result:", data);
}

export async function permifyCheck({
  userId,
  permission,
  entity,
}: {
  userId: string;
  permission: string;
  entity: { type: string; id: string };
}) {
  const res = await fetch(
    "http://localhost:3476/v1/tenants/t1/permissions/check",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        metadata: {
          schema_version: "",
          depth: 3,
        },
        entity,
        permission,
        subject: {
          type: "user",
          id: userId,
        },
      }),
    }
  );

  return res.json();
}
