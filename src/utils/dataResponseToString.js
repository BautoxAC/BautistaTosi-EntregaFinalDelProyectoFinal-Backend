export function dataResponseToString (response) {
  const { data, ...rest } = response
  return { data: JSON.stringify(data), ...rest }
}
