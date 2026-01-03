export const login = async (_credentials: unknown) => {
    return { user: { id: 1, name: 'Admin' }, token: 'fake-token' };
};

export const logout = async () => {
    return true;
};
