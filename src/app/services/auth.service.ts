import { Injectable } from '@angular/core';
import { Auth, signOut, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private provider = new GoogleAuthProvider();

    constructor(private auth: Auth, 
        private firestore: Firestore, 
        private router: Router) {}

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
            createdAt: Date.now()
        }, { merge: true });
    }
}