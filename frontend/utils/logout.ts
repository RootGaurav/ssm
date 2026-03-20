export function logout(redirectPath: string) {


  // Clear sessionStorage
  sessionStorage.clear()

  // Clear all cookies
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC"

  // Clear browser history and redirect
  window.location.href = redirectPath
  
  // Prevent back button from showing cached page
  history.pushState(null, "", redirectPath)
  
}
