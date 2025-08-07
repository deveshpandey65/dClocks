export const signOut = () => {
    localStorage.removeItem('token'); // If using localStorage
    window.location.href = '/login';  // Redirect to login page
};