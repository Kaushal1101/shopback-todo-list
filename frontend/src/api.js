const BASE = '/api/tasks'

async function parseError(res) {
  try {
    const body = await res.json()
    if (Array.isArray(body.detail)) {
      // Pydantic validation error — strip the "Value error, " prefix it adds
      return body.detail[0].msg.replace('Value error, ', '')
    }
    if (typeof body.detail === 'string') return body.detail
  } catch {}
  return 'Something went wrong'
}

export async function getTasks() {
  const res = await fetch(BASE)
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

export async function createTask(task) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

export async function updateTask(id, changes) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(changes),
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

export async function deleteTask(id) {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}
