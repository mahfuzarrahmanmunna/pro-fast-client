import React, { useEffect, useState } from 'react';
import { AuthContext } from '../../Context/AuthContext/AuthContext';
import { auth } from '../../Firebase/firebase.init';
import {
    updateProfile as firebaseUpdateProfile,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Create account with email and password
    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    // Sign in with email and password
    const signIn = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    // ✅ Fixed: return the result from signInWithPopup
    const googleLogin = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    };

    const logout = () => {
        setLoading(true);
        return signOut(auth);
    };

    const updateUserProfile = (profile) => {
        if (!auth.currentUser) throw new Error('No user logged in');
        return firebaseUpdateProfile(auth.currentUser, profile);
    };

    // Listen for auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const authInfo = {
        user,
        loading,
        createUser,
        signIn,
        googleLogin,
        logout,
        updateUserProfile,
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
