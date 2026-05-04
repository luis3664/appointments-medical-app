import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private provider = new GoogleAuthProvider();

    constructor(private auth: Auth, private firestore: Firestore) {}

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