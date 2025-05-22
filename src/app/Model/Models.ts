import { Message } from "../chat/chat/chat.component";

export interface loginUser{
  email :string ;
  password :string;
}
export interface gym{
  gymID: number,
  gymName: string
  pictureUrl ?: string,
  address: string,
  city: string,
  governorate: string,
  monthlyPrice: number,
  averageRating: number,
  subscriptionsCount: number ,
}
export interface GymResponse {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  data: gym[];
}

export interface Trainer {
  id: string;
  fullName: string;
  profilePictureUrl ?: string ;
  bio: string;
  gender: string;
  joinedDate: string;
  rating: number;
}

export interface TrainersResponse {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  data: Trainer[];
}
export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender: string;
  dateOfBirth: Date | string;
  bio: string;
}
export interface GoogleAuthTokens {
  idToken: string;
  accessToken: string;
}
export interface CheckTokenResponse {
  isSuccess: boolean;
  data: {
    checktoken: string;
    exipiration: string;
  };
}



export interface gymData{
  gymName: string
  pictureUrl ?: string,
  address: string,
  city: string,
  governorate: string,
  monthlyPrice: number,
  averageRating ?: number,
  subscriptionsCount ?: number ,
  description : string
}
export interface ApiResponse {
  isSuccess: boolean;
  data: string;
}
interface OnlineTraining {
  // Define the properties of an online training if known, otherwise use 'any' or an empty object
}
export interface coachDetails{
  id: string;
  fullName: string;
  profilePictureUrl: string | null;
  bio: string;
  gender: "male" | "female" ;
  joinedDate: string;
  rating: number ;
  onlineTrainings: OnlineTraining[];
}
export interface coachResponse{
  isSuccess : boolean;
  data :coachDetails
}
export interface VerificationModel {
  email: string;
  verificationCode: string;
}
export interface ResetPasswordModel {
  email: string | null;
  newPassword: string;
  confirmPassword: string;
}
export interface TokenResponse {
  token: string;
  refreshToken: string;
  exipiration: Date;
}

export interface loginResponse {
  data : TokenResponse;
  isSuccess : boolean;
}
export interface TrainingProgram {
  title: string;
  description?: string;
  trainingType: string;
  price: number;
  noOfSessionsPerWeek: number;
  durationOfSession?: number;
}
export interface APiRes {
  message: string;
}

export interface TrainingModelResponse {
  id: number;
  coachID: string;
  title: string;
  description: string;
  trainingType: string;
  price: number;
  noOfSessionsPerWeek: number;
  durationOfSession: number;
  onlineTrainingSubscriptions ?: any;
}
export interface coachProfile {
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  bio: string;
  profilePictureUrl :string | null;
}
export interface GymInfo {
  gymID: number;
  gymName: string;
  pictureUrl: string | null;
  address: string;
  city: string;
  governorate: string;
  monthlyPrice: number;
  yearlyPrice: number;
  fortnightlyPrice: number;
  sessionPrice: number;
  phoneNumber: string;
  description: string;
  coachID: string;
  coachFullName: string;
  coachProfilePictureUrl: string | null;
  averageRating: number;
  subscriptionsCount: number;
}

export interface OnlineTrainingForm {
  title: string;
  description: string;
  trainingType: string;
  price: number;
  noOfSessionsPerWeek: number;
  durationOfSession: number;
}
export interface shopInfo {
  name: string;
  imageUrl ?: string;
  address: string;
  city: string;
  governorate: string;
  phoneNumber: string;
  description: string;
}
export interface TrainingSession {
  id: number;
  coachID: string;
  title: string;
  description: string;
  trainingType: string;
  price: number;
  noOfSessionsPerWeek: number;
  durationOfSession: number;
}
export interface ChangePassword {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
export interface Shop {
  address: string;
  city: string;
  description: string;
  followerNumber: number;
  governorate: string;
  ownerID: string;
  ownerName: string;
  phoneNumber: string;
  pictureUrl: string;
  shopId: number;
  shopName: string;
}

export interface ShopResponse {
  data: Shop[];
  isSuccess: boolean;
}
export interface GymRating {
  gymRatingID: number;
  ratingValue: number;
  review: string;
  traineeID: string;
}
export interface ChatResponse {
  isSuccess: boolean;
  data: {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalRecords: number;
    data: Message[];
  };
}
export interface isFollowingResponse {
  isFollowing: boolean;
}
