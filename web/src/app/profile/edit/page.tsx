"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingEyeProgress from "@/components/LoadingEyeProgress";
import { themeColor } from "@/constants/colors";
import { useAuth } from "@/auth/AuthProvider";
import GradientFill from "@/components/signup/GradientFill";
import Header2 from "@/components/typography/Header2";
import Separator from "@/components/signup/Separator";
import { getUserFromId } from "@/api/user/getUserFromId";
import { UserData } from "@/api/user/getUser";
import ImageForm from "@/components/signup/ImageForm";
import GradientButton from "@/components/GradientButton";
import NicknameForm from "@/components/signup/NicknameForm";
import { postUserUpdate } from "@/api/user/postUserUpdate";
import { signOut, useSession } from "next-auth/react";
import SignOutButton from "@/constants/signOutButton";
import { postUserUnregister } from "@/api/user/postUserUnregister";

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const { data: session } = useSession();

  const { user, checkSignupState: checkUserAuth } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push("/");
    } else {
      setUserName(user.nickname);
      setProfileImage(user.profilePicture ?? "");
    }
  }, [user]);

  if (!user) {
    router.push("/");
    return;
  }

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
        height: "100vh",
        background: themeColor.primary,
      }}
    >
      <GradientFill>
        <Header2 text="EDIT PROFILE" />
        <Separator />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            gap: 10,
            marginBottom: 50,
            alignItems: "center",
          }}
        >
          <ImageForm
            profileImage={profileImage}
            setProfileImage={setProfileImage}
          />
          <div style={{ flex: 1 }} />
          <NicknameForm nickname={userName} setNickname={setUserName} />
          <div style={{ flex: 2 }} />
          <SignOutButton
            color="#8176AF"
            text="Save"
            onClick={async () => {
              session &&
                postUserUpdate(userName, profileImage, session).then(() => {
                  checkUserAuth().then(() => {
                    router.push("/profile/" + user.id);
                  });
                });
            }}
          />
          <SignOutButton onClick={() => signOut()} />
          <SignOutButton
            dialog
            text="Delete Account"
            onClick={async () => {
              session &&
                postUserUnregister(session).then(() => {
                  signOut();
                });
            }}
          />
        </div>
      </GradientFill>
    </main>
  );
};

export default ProfilePage;
