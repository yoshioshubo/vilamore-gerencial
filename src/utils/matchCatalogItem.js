function normalize(str) {
  return (str || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Tenta casar a descrição extraída de uma contagem de estoque com um item do catálogo.
 * Retorna o item do catálogo correspondente, ou null se não encontrar.
 */
export function matchCatalogItem(descricao, catalogItems) {
  const target = normalize(descricao)
  if (!target) return null

  const exact = catalogItems.find(it => normalize(it.name) === target)
  if (exact) return exact

  const partial = catalogItems.find(it => {
    const name = normalize(it.name)
    return name.includes(target) || target.includes(name)
  })
  return partial || null
}
