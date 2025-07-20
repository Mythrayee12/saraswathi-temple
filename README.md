# 🕉️ Jaganmatha Devasthanam Website

## ✨ Overview

This is the official website for the Saraswati Temple, designed to serve our community by providing information about temple events, services, and spiritual resources. Built with modern web technologies, it aims to offer a seamless and engaging experience for devotees.

## 🌟 Features

* **Dynamic Event Calendar:** Stay updated with upcoming pujas, festivals, and special events.
* **Service Information:** Details on various temple services, including Abhishekams, Archana, and personalized pujas.
* **Gallery:** A beautiful collection of temple photographs.
* **Contact & Location:** Easy access to temple address, contact details, and directions.
* **Responsive Design:** Optimized for various devices, from desktops to mobile phones.
* **Interactive Charts (if applicable):** Data visualization for temple activities or donations (based on `recharts` usage).

## 🚀 Technologies Used

This project leverages the following key technologies:

* **React 19:** A powerful JavaScript library for building user interfaces.
* **Firebase:** Google's platform for building web and mobile applications (for backend services, data storage, etc.).
* **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
* **Shadcn/ui:** Reusable components built with Radix UI and Tailwind CSS for beautiful and accessible UI.
    * Specifically, it uses components from `@radix-ui/react-avatar`, `@radix-ui/react-accordion`, `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-separator`, `@radix-ui/react-slot`, etc.
* **Lucide React:** A beautiful collection of open-source icons.
* **React Day Picker:** A flexible and accessible date picker component.
* **Embla Carousel React:** A lightweight and highly customizable carousel library.
* **Recharts:** A composable charting library built on React components.
* **TypeScript:** For type-safe JavaScript development.
* **`react-scripts`:** For managing the development server and build process.

## 🛠️ Installation

Follow these steps to set up the project locally on your machine.

### Prerequisites

Ensure you have Node.js (v18 or higher recommended) and npm (or Yarn) installed.

### Steps

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd saraswathi-temple-app # Or whatever your project folder name is
    ```

2.  **Install dependencies:**
    This command will install all the necessary packages listed in `package.json`.

```bash
npm start
# Or if you use Yarn:
# yarn start
This will open the application in your browser at http://localhost:3000 (or another port if 3000 is in use). The page will reload if you make edits.

📦 Building for Production
To create a production-ready build of the application:

Bash

npm run build
# Or if you use Yarn:
# yarn build
This command builds the app for production to the build folder. It correctly bundles React in production mode and optimizes the build for the best performance.

🤝 Contributing
Contributions are welcome! If you'd like to contribute, please fork the repository and use a feature branch. Pull requests are warmly appreciated.

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.


---

Remember to replace `<your-repository-url>` with the actual URL of your Git repository. Also, adjust the Firebase environment variables section if your project uses different variable names or doesn't use Firebase.
