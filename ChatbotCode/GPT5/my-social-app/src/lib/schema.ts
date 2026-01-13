export type Visibility = "public" | "friends";

export type UserDoc = {
  uid: string;
  displayName: string; // public
  name: string;        // public (what others see)
  age: number | null;  // public
  city: string;        // public
  country: string;     // public
  aboutMe: string;     // public
  bannerKey: string;   // public
  themeKey: string;    // private-ish (used by UI)
  referralPoints: number;
  referralOptOut: boolean;
  profilePhotoPath: string; // storage path
};

export type PostDoc = {
  authorUid: string;
  authorName: string;
  text: string;
  visibility: Visibility;
  createdAt: any;
  imagePath?: string;
};

