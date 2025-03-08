import { IMenuItem, ISocials } from "@/types";

export const footerDetails: {
    subheading: string;
    quickLinks: IMenuItem[];
    socials: ISocials;
} = {
    subheading: "Uniting communities for a cleaner, greener and sustainable future",
    quickLinks: [
        {
            text: "LeaderBoard",
            url: "/leaderboard"
        },
        {
            text: "SignIn",
            url: "/auth"
        },
        {
            text: "DashBoards",
            url: "/auth"
        }
    ],
    socials: {
        github: 'https://github.com/Nishthajain7/Define25',
    }
}