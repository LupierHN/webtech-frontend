export function logError(err: unknown): void {
  alert('Something went wrong ... check your browser console for more information')
  console.error(err)
}
