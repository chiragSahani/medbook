# Medbook

![Medbook Logo](https://res.cloudinary.com/dlyctssmy/image/upload/v1740888360/medical-doctor_q1fip7.png)

Medbook is a comprehensive platform designed to streamline the process of booking medical appointments, managing doctor and patient profiles, facilitating real-time consultations, and handling secure payments. The project is built using a modern tech stack to ensure a seamless and efficient user experience.

## Tech Stack

- **Frontend**: React.js (hosted on Netlify)
- **Backend**: Supabase (PostgreSQL-based BaaS)
- **Database**: SQLite (for local development) → Supabase (production)
- **Authentication**: Supabase Auth (JWT-based)
- **Payment Gateway**: Razorpay
- **Real-time Features**: Supabase Realtime (WebSockets)

## Features

### Authentication & User Management
- **Signup & Login**: JWT-based Supabase Auth
  - `supabase.auth.signUp()`: User registration
  - `supabase.auth.signInWithPassword()`: User login
  - `supabase.auth.signOut()`: Logout

### Doctor & Patient Profile Management
- **Users Table**: Stores user details (patients & doctors)
- **Doctors Table**: Stores doctor profiles & availability
- **Appointments Table**: Stores booking details

### Booking System
- **Book Appointment**: `supabase.from('appointments').insert({...})`
- **Fetch Appointments**: `supabase.from('appointments').select('*')`
- **Cancel Appointment**: `supabase.from('appointments').delete().eq('id', appointment_id)`

### Payment Integration
- **Generate Payment Link**: `/api/payment/create`
- **Verify Transaction**: `/api/payment/verify`
- **Process Refund**: `/api/payment/refund/:id`

### Real-time Chat & Consultation
- **Live Chat**: `supabase.channel('chat').on('INSERT', callback).subscribe()`
- **Video Consultation**: WebRTC API

### Deployment & Hosting
- **Frontend**: Netlify
- **Backend**: Supabase Functions & DB
- **Database**: SQLite (for local development), PostgreSQL (via Supabase in production)

## Final Workflow

1. User signs up using Supabase Auth
2. Books an appointment (stored in Supabase DB)
3. Makes payment via Razorpay
4. Gets a confirmation & joins consultation via WebRTC
5. Doctor updates the prescription & notes

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:
   ```sh
   git clone https://github.com/chiragSahani/medbook.git
   cd medbook
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Set up environment variables for Supabase, Razorpay, and other configurations.

4. Start the development server:
   ```sh
   npm start
   ```

## Contributing

We welcome contributions to improve Medbook. Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

## License

This project is licensed under Apache-2.0 License.

---

