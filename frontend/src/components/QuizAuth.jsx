export default function QuizAuth() {
  return (
    <div
      data-theme="fantasy" // DaisyUI theme (can change to lemonade, fantasy, etc.)
      className="min-h-screen flex items-center justify-center bg-base-200"
    >
      <div className="card w-96 bg-base-100 shadow-2xl rounded-2xl">
        <div className="card-body items-center text-center">
          {/* Title */}
          <h1 className="text-3xl font-bold text-primary mb-6">
            Welcome to Quiz App 🎉
          </h1>
          <p className="text-base-content mb-8">
            Test your knowledge and challenge yourself with fun quizzes!
          </p>

          {/* Buttons */}
          <div className="flex flex-col gap-4 w-full">
            <button className="btn btn-primary w-full">Log In</button>
            <span className="text-sm text-gray-500">OR</span>
            <button className="btn btn-secondary w-full">Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
}
