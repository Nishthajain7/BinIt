import {FiBriefcase, FiDollarSign, FiLock, FiPieChart, FiShield, FiTarget, FiUser, FiCamera, FiCheckCircle} from "react-icons/fi";

import { IBenefit } from "@/types"

export const benefits: IBenefit[] = [
    {
        title: "Effortless Waste Management",
        description: "Report, track, and ensure cleaner surroundings with ease. BinIt connects citizens and cleaners to create a garbage-free community.",
        bullets: [
            {
                title: "Instant Reporting",
                description: "Snap a photo, pin the location, and let us handle the rest.",
                icon: <FiCamera size={26} />
            },
            {
                title: "Seamless Cleanup Tracking",
                description: "Monitor the progress of your reported waste in real time.",
                icon: <FiTarget size={26} />
            },
            {
                title: "Verified Cleanups",
                description: "Cleaners upload 'after' images, ensuring transparency and accountability.",
                icon: <FiCheckCircle size={26} />
            }
        ],
        imageSrc: "/images/mockup-1.webp"
    },
    {
        title: "Our Aim",
        description: "At BinIt, we strive to create cleaner and healthier communities by bridging the gap between citizens and cleaners. We make waste management transparent, and impactful through technology.",
        bullets: [
            {
                title: "Encourage Community Participation",
                description: "Empower people to report garbage effortlessly and be a part of the change.",
                icon: <FiDollarSign size={26} />
            },
            {
                title: "Engage Education Institutions",
                description: "We collaborate with schools, colleges, and organizations to host cleanup challenges, fostering environmental responsibility through friendly competition and rewards.",
                icon: <FiBriefcase size={26} />
            },
            {
                title: "Leverage Technology for a Greener Future",
                description: "Use location tracking and image verification to enhance waste management efficiency",
                icon: <FiPieChart size={26} />
            }
        ],
        imageSrc: "/images/mockup-2.webp"
    }
]