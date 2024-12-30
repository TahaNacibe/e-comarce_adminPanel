import Image from "next/image"


export default function ProfileImageAndPlaceHolder({ userName, userImage }: { userName: string, userImage?: string }) {
    //* consts
    const IMAGE_HEIGHT = 38
    const IMAGE_WIDTH = 38
    
    //* get first two letters for place holder
    const getUserNameFirstLetters = () => {
        const userNameSliced = userName.split(' ')
        // if the user has only one name
        if (userNameSliced.length === 1) {
            return userNameSliced[0].slice(0,2).toUpperCase()
        }
        // if the user has two names or more
        return userNameSliced[0].slice(0,1).toUpperCase() + userNameSliced[1].slice(0,1).toUpperCase()
    }

    //* profile place holder widget
    const ProfileImagePlaceHolder = () => {
        return (
            <div className={`rounded-full bg-blue-900 flex justify-center items-center self-center w-9 h-9 text-white m-2`}>
                <h1 className="font-medium text-lg align-middle">
                    {getUserNameFirstLetters()}
                </h1>
            </div>
        )
    }

    //* if user have no image (null or undefine case)
    if (!userImage) return <ProfileImagePlaceHolder />
    
    //* if user have image
    return (
        <div className="m-1">
            <Image
                src={`${userImage}`}
                alt="profile image"
                width={IMAGE_WIDTH}
                height={IMAGE_HEIGHT}
                className="rounded-full"
            />
        </div>
    )
}