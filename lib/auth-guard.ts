export function getLoginUrl(redirectTo: string = '/'): string {
  return `/login?redirect=${encodeURIComponent(redirectTo)}`;
}

export function getSafeRedirect(param: string | null): string {
  if (!param || !param.startsWith('/') || param.startsWith('//')) {
    return '/profile';
  }
  return param;
}
