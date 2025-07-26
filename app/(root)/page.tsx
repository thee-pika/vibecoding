
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Home = () => {
    return (
        <div className="h-[calc(100vh-140px)] bg-gradient-to-br from-gray-900 to-black text-white font-sans">

            <section className="flex flex-col items-center justify-center py-24 text-center px-6">

                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                    Welcome to <span className="text-indigo-500">codeX</span>
                </h1>
                <p className="mt-6 text-lg md:text-xl max-w-xl">
                    Your all-in-one online IDE to <span className="text-indigo-400 font-semibold">code anything, anywhere</span>.
                </p>
                <div className="mt-8 flex gap-4">
                    <Link href={"/dashboard"}>
                        <button className="bg-indigo-500 hover:bg-indigo-600 px-6 py-3 rounded-xl text-white font-semibold">
                            Get Started
                        </button>
                    </Link>
                </div>
                <Image
                    src={"/hero2.png"}
                    alt="hero"
                    width={500}
                    height={500}
                    className="mt-10"
                />
            </section>

        </div>
    );
};

export default Home;
