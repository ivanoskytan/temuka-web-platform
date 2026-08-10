export interface UserData {
  ID: Number;
  Username: string;
  Displayname: string;
  ProfilePicture: string;
}

export interface UserSearchItem {
  ID: number;
  Username: string;
  Displayname?: string;
  Email?: string;
  ProfilePicture?: string;
  CoverPicture?: string;
}

export interface FollowersData {
  ID: Number;
  Username: string;
  ProfilePicture: string;
  Email: string;
}

export interface ProfileID {
  ID: number;
}

export interface CommunityCardData {
  ID?: any;
  Name: string;
  Slug: string;
  Description: string;
  MembersCount: number;
  LogoPicture: string;
  CoverPicture: string;

  isJoined?: boolean;
  isJoining?: boolean;
}

export interface CommunityData {
  ID?: any;
  Name: string;
  Slug: string;
  Description: string;
  Rules: string;
  PostCount: number;
  MemberCount: number;
  LogoPicture: string;
  CoverPicture: string;
}

export interface PostData {
  ID?: any;
  UserID: number;
  Title: string;
  Description: string;
  Image?: string;
  Upvote?: string[];
  Comments?: number;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export interface PostCommentData {
  ID?: any;
  Username: string;
  Userphoto: string;
  PostID: number;
  Content: string;
  Votes: number;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export interface CommentData {
  ID?: any;
  UserID: number;
  ParentID: number;
  PostID: number;
  Content: string;
  Votes: number;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export interface UserDetailData {
  ID?: string;
  Username: string;
  Displayname?: string;
  Desc?: string;
  Email?: string;
  ProfilePicture?: string;
  SocialPoint?: number;
  Followings?: number[];
  Followers?: number[];
  CreatedAt?: Date;
}

export interface UserAuthData {
  Username?: string;
  Email: string;
  Password: string;
}

export interface UniversityData {
  ID?: number;
  Name: string;
  Slug: string;
  Summary: string;
  Website: string;
  TotalReviews: number;
  TotalMajors: number;
  Logo: string;
  Address: string;
  Rating: number | null;
  Type: string;
  Accreditation: string;
  Reviews?: UniversityReview[];
  MinTuition: number;
  MaxTuition: number;
  AcceptanceRate: number;
}

export interface MajorUniversityData {
  ID?: number;
  Name: string;
  Logo?: string;
}

export interface MajorData {
  ID?: number;
  Name: string;
  Description: string;
  UniversityName: string;
  UniversityLogo: string;
  TotalReviews?: number;
  Rating?: number | null;
  Reviews?: MajorReview[];
  CreatedAt: Date;
  UpdatedAt: Date;
}

export interface UniversityMajorData {
  ID?: number;
  Name: string;
  Description: string;
  UniversityName: string;
  UniversityLogo: string;
  TotalReviews?: number;
  Rating?: number | null;
  Reviews?: MajorReview[];
  CreatedAt: Date;
  UpdatedAt: Date;
}

export interface UniversityReview {
  ID?: number;
  UniversityID?: number;
  UserID: Number;
  Username: string;
  Displayname: string;
  ProfilePicture: string;
  Text: string;
  Stars: number;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export interface MajorReview {
  ID?: number;
  MajorID: number;
  UserID: Number;
  Username: string;
  Displayname: string;
  ProfilePicture: string;
  Text: string;
  Stars: number;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export interface SuggestionItemData {
  ID: string;
  Title: string;
  Type: string;
  ContextID?: string;
  ScoreMultiplier: number;
  Icon?: string;
  Slug?: string;
  Metadata?: Record<string, unknown>;
}

export interface SearchSuggestion {
  Query: string;
  Communities: SuggestionItemData[];
  Majors: SuggestionItemData[];
  Universities: SuggestionItemData[];
  Users: SuggestionItemData[];
  Posts: SuggestionItemData[];
}

export interface SearchHistoryItemData {
  Query: string;
  EntityID?: string;
  EntityType?: string;
  Slug?: string;
}

export interface SearchHistory {
  UserId: string;
  History: SearchHistoryItemData[];
}

export interface GeneralAPIResponse<T> {
  message: string;
  data: T;
}

export interface GeneralAPIMutateResponse {
  status: boolean;
  message: string;
}

export type GeneralUserDetailResponse = GeneralAPIResponse<UserDetailData>;
export type GeneralPostDetailResponse = GeneralAPIResponse<PostData>;
export type GeneralUserRegisterResponse = GeneralAPIResponse<UserAuthData>;
export type GeneralMajorDetailResponse = GeneralAPIResponse<MajorData>;
export type GeneralUserLoginResponse = GeneralAPIResponse<UserAuthData> & { token: string };
export type GeneralPostResponse = GeneralAPIResponse<PostData[]>;
export type GeneralFollowerListResponse = GeneralAPIResponse<FollowersData[]>;
export type GeneralUniversityListResponse = GeneralAPIResponse<UniversityData[]>;
export type GeneralMajorListResponse = GeneralAPIResponse<MajorData[]>;
export type GeneralSearchUserResponse = GeneralAPIResponse<UserSearchItem[]>;
export type GeneralUniversityReviewsResponse = GeneralAPIResponse<UniversityReview[]>;
export type GeneralSearchSuggestResponse = GeneralAPIResponse<SearchSuggestion>;
export type GeneralSearchHistoryResponse = GeneralAPIResponse<SearchHistory>;