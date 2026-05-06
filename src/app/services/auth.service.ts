import { Injectable } from '@angular/core';
import { Auth, signOut, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { authState } from '@angular/fire/auth';
import { UserModel } from '../models/user.model'


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    user$: Observable<any>;

    private provider = new GoogleAuthProvider();

    constructor(private auth: Auth, 
        private firestore: Firestore, 
        private router: Router) {
            this.user$ = authState(this.auth);
        }

    async register(email: string, password: string) {
        const res = await createUserWithEmailAndPassword(this.auth, email, password);

        await this.saveUser(res.user);

        return res;
    }

    async loginWithGoogle() {
        const res = await signInWithPopup(this.auth, this.provider);

        await this.saveUser(res.user);

        return res;
    }

    async logout() {
        await signOut(this.auth);
        // 👇 ahora sí se ejecuta
        this.router.navigate(['/index']);
    }

    async saveUser(user: any) {
        const ref = doc(this.firestore, `users/${user.uid}`);

        await setDoc(ref, {
            uid: user.uid,
            email: user.email,
            name: user.displayName || 'Sin nombre',
            role: 'user',
            createdAt: Date.now()
        }, { merge: true });
    }

    async getCurrentUserData(): Promise<UserModel | null> {

        const user = this.auth.currentUser;
        if (!user) return null;

        const ref = doc(this.firestore, `users/${user.uid}`);
        const snap = await getDoc(ref);

        return snap.exists() ? (snap.data() as UserModel) : null;
    }
}