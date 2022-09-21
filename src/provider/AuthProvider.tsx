import React, { createContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { Session } from '@supabase/supabase-js';

type ContextProps = {
	user: null | boolean;
	session: Session | null;
};

const AuthContext = createContext<Partial<ContextProps>>({});

interface Props {
	children: React.ReactNode;
}

const AuthProvider = (props: Props) => {
	const auth = getAuth();

	// user null = loading
	const [user, setUser] = useState<null | boolean>(null);
	const [session, setSession] = useState<Session | null>(null);

	// useEffect(() => {
	// 	const session = supabase.auth.session();
	// 	setSession(session);
	// 	setUser(session ? true : false);
	// 	const { data: authListener } = supabase.auth.onAuthStateChange(
	// 		async (event, session) => {
	// 			console.log(`Supabase auth event: ${event}`);
	// 			setSession(session);
	// 			setUser(session ? true : false);
	// 		}
	// 	);
	// 	return () => {
	// 		authListener!.unsubscribe();
	// 	};
	// }, [user]);

	useEffect(() => {
		checkGoogleLogin();
	}, []);

	function checkGoogleLogin() {
		onAuthStateChanged(auth, (u) => {
			if (u) {
				setUser(true);
				// getUserData();
			} else {
				setUser(false);
				// setUserData(null);
			}
		});
	}


	return (
		<AuthContext.Provider
			value={{
				user,
				session,
			}}
		>
			{props.children}
		</AuthContext.Provider>
	);
};

export { AuthContext, AuthProvider };
