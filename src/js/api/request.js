const headers = {
  "Content-Type": "application/json",
};
const protocol = "http";
const domain = "localhost";
const port = 5000;
const server = `${protocol}://${domain}:${port}`;

export async function get(url) {
  const req = await fetch(server + url, { headers });
  const res = await req.json();
  return res;
}

export async function post(url, body) {
  try {
    const req = await fetch(server + url, {
      headers,
      method: "POST",
      body: JSON.stringify(body),
    });
    const res = await req.json();
    return res;
  } catch (error) {}
}
