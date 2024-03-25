# Login Server

This project is a login server that provides a signup option, forgot password functionality, and also automatically calculates attendance and PTO (Paid Time Off) for employees. The server is deployed on Vercel.

## Features

- **Signup**: Users can create new accounts by providing their email address, username, and password.

- **Forgot Password**: Users who have forgotten their password can request a password reset. They will receive an email with instructions on how to reset their password.

- **Attendance Calculation**: The server automatically tracks and calculates the attendance of employees based on their login and logout times. This information can be used for various purposes such as payroll processing and performance evaluation.

- **PTO Calculation**: The server also automatically calculates the Paid Time Off (PTO) for employees based on their employment contract and the number of days they have taken off. This helps in managing employee leave and ensuring compliance with company policies.

## Deployment

The login server is deployed on Vercel, a cloud platform for static sites and serverless functions. Vercel provides a reliable and scalable infrastructure for hosting web applications, making it an ideal choice for this project.

To deploy the server on Vercel, follow these steps:

1. Sign up for a Vercel account at [vercel.com](https://vercel.com).

2. Create a new project and connect it to your GitHub repository or upload your project files directly.

3. Configure the necessary environment variables, such as database connection details and email service credentials, in the Vercel dashboard.

4. Deploy the project to Vercel using the provided deployment options.

5. Once deployed, the login server will be accessible at the provided Vercel URL.

## Usage

To use the login server, follow these steps:

1. Visit the login page and click on the "Signup" link to create a new account.

2. If you forget your password, click on the "Forgot Password" link and follow the instructions in the email you receive.

3. Log in to your account using your email address and password.

4. The server will automatically track your attendance and calculate your PTO based on your login and logout times.

## Contributing

Contributions to this project are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request on the GitHub repository.

## License

This project is licensed under the [MIT License](LICENSE).
