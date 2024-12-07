'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from '@/lib/firebase/firebase';
import { useUsersContext } from '@/lib/providers/users.context';
import { useRouter } from 'next/navigation';
import Loader from '@/components/loader';
import { useLocalStorage } from '@/hooks/use-local-storage';
const AddUsers = () => {
  const [message, setMessage] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organization, setOrganization] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const { AddUserHandler } = useUsersContext();
  const router = useRouter();
  const [user, setUser] = useLocalStorage('user', {});
  const [loading, setLoading] = useState(false);

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Basic form validation
      if (
        !firstName ||
        !lastName ||
        !email ||
        !password ||
        !organization ||
        !phoneNumber ||
        !role
      ) {
        setMessage('Please fill out all fields.');
        return;
      }

      // Password validation
      if (!validatePassword(password)) {
        setMessage(
          'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.'
        );
        return;
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setMessage('Please enter a valid email address.');
        return;
      }

      // Here you can perform an API request to save the user data to the backend
      const userData = {
        firstName,
        lastName,
        email,
        password,
        organization,
        phoneNumber,
        role
      };

      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
        .then(async (userCredential) => {
          // Signed up
          const user = userCredential.user;

          try {
            const res = await AddUserHandler({
              uid: user?.uid,
              firstName,
              lastName,
              email,
              username,
              role,
              hospital: null,
              license: null,
              phoneNumber,
              organization,
              agreeTerms: true
            });
          } catch (error) {
            console.log(error);
          }
          alert({
            title: 'Success',
            description:
              'Account created successfully, login to access your Account',
            status: 'success',
            duration: 5000,
            isClosable: true
          });

          router.push(`/${user?.uid}/users`);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
        });

      // Reset form fields after submission
      // setFirstName('');
      // setLastName('');
      // setEmail('');
      // setPassword('');
      // setOrganization('');
      // setPhoneNumber('');
      // setRole('');
      setLoading(false);
    } catch (error) {
      console.error('Error adding user:', error);
      setMessage('Error adding user. Please try again.');
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="mb-4 text-2xl font-semibold">Add User</h1>
      {message && <p className="mb-4 text-red-500">{message}</p>}
      <form onSubmit={handleSubmit} className="max-w-sm">
        <div className="mb-4">
          <label htmlFor="firstName" className="mb-1 block font-semibold">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="lastName" className="mb-1 block font-semibold">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            required
          />
        </div>{' '}
        <div className="mb-4">
          <label htmlFor="lastName" className="mb-1 block font-semibold">
            User Name
          </label>
          <input
            type="text"
            id="lastName"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="mb-1 block font-semibold">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="mb-1 block font-semibold">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none ${
              validatePassword(password) ? 'border-gray-300' : 'border-red-500'
            }`}
            required
          />
          {!validatePassword(password) && (
            <p className="mt-1 text-sm text-red-500">
              Password must be at least 8 characters long and contain at least
              one uppercase letter, one lowercase letter, one digit, and one
              special character.
            </p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="organization" className="mb-1 block font-semibold">
            Organization
          </label>
          <input
            type="text"
            id="organization"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="phoneNumber" className="mb-1 block font-semibold">
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="role" className="mb-1 block font-semibold">
            Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            required
          >
            <option value="">Select Role</option>
            <option value="pharmaceutical">pharmaceutical</option>
            <option value="labelReviewer">label Reviewer</option>
            <option value="assessor">Assessor</option>
            <option value="qaofficer">QA Officer</option>
            <option value="IT">IT</option>
          </select>
        </div>
        <button
          type="submit"
          className="rounded-md bg-green-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          {loading ? <Loader /> : 'Add User'}
        </button>
      </form>
    </div>
  );
};

export default AddUsers;
