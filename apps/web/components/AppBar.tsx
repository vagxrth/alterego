import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton
} from '@clerk/nextjs'
import Link from 'next/link'

const AppBar = () => {
    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="flex items-center">
                        <span className="text-xl font-bold text-gray-900">AlterEgo</span>
                    </Link>

                    <div className="flex items-center space-x-4">
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="text-gray-700 hover:text-gray-900 px-3 py-2 cursor-pointer rounded-md text-sm font-medium">
                                    Sign In
                                </button>
                            </SignInButton>
                            <SignUpButton mode="modal">
                                <button className="bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-md cursor-pointer text-sm font-medium">
                                    Sign Up
                                </button>
                            </SignUpButton>
                        </SignedOut>
                        <SignedIn>
                            <UserButton afterSignOutUrl="/" />
                        </SignedIn>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AppBar