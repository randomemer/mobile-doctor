/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateRecording = /* GraphQL */ `
  subscription OnCreateRecording(
    $mail_id: String
    $timestamp: String
    $bucketpath_recording: String
    $bucketpath_denoised: String
    $pulse: Int
  ) {
    onCreateRecording(
      mail_id: $mail_id
      timestamp: $timestamp
      bucketpath_recording: $bucketpath_recording
      bucketpath_denoised: $bucketpath_denoised
      pulse: $pulse
    ) {
      mail_id
      timestamp
      bucketpath_recording
      bucketpath_denoised
      bpm
      user_doctor
      doctorInfo {
        mail_id
        first_name
        last_name
        is_doctor
        phone
        gender
      }
      audio_length
      comment
    }
  }
`;
export const onUpdateRecording = /* GraphQL */ `
  subscription OnUpdateRecording(
    $mail_id: String
    $timestamp: String
    $bucketpath_recording: String
    $bucketpath_denoised: String
    $pulse: Int
  ) {
    onUpdateRecording(
      mail_id: $mail_id
      timestamp: $timestamp
      bucketpath_recording: $bucketpath_recording
      bucketpath_denoised: $bucketpath_denoised
      pulse: $pulse
    ) {
      mail_id
      timestamp
      bucketpath_recording
      bucketpath_denoised
      bpm
      user_doctor
      doctorInfo {
        mail_id
        first_name
        last_name
        is_doctor
        phone
        gender
      }
      audio_length
      comment
    }
  }
`;
export const onDeleteRecording = /* GraphQL */ `
  subscription OnDeleteRecording(
    $mail_id: String
    $timestamp: String
    $bucketpath_recording: String
    $bucketpath_denoised: String
    $pulse: Int
  ) {
    onDeleteRecording(
      mail_id: $mail_id
      timestamp: $timestamp
      bucketpath_recording: $bucketpath_recording
      bucketpath_denoised: $bucketpath_denoised
      pulse: $pulse
    ) {
      mail_id
      timestamp
      bucketpath_recording
      bucketpath_denoised
      bpm
      user_doctor
      doctorInfo {
        mail_id
        first_name
        last_name
        is_doctor
        phone
        gender
      }
      audio_length
      comment
    }
  }
`;
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser(
    $mail_id: String
    $first_name: String
    $last_name: String
    $is_doctor: Boolean
    $phone: String
  ) {
    onCreateUser(
      mail_id: $mail_id
      first_name: $first_name
      last_name: $last_name
      is_doctor: $is_doctor
      phone: $phone
    ) {
      mail_id
      first_name
      last_name
      is_doctor
      phone
      gender
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser(
    $mail_id: String
    $first_name: String
    $last_name: String
    $is_doctor: Boolean
    $phone: String
  ) {
    onUpdateUser(
      mail_id: $mail_id
      first_name: $first_name
      last_name: $last_name
      is_doctor: $is_doctor
      phone: $phone
    ) {
      mail_id
      first_name
      last_name
      is_doctor
      phone
      gender
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser(
    $mail_id: String
    $first_name: String
    $last_name: String
    $is_doctor: Boolean
    $phone: String
  ) {
    onDeleteUser(
      mail_id: $mail_id
      first_name: $first_name
      last_name: $last_name
      is_doctor: $is_doctor
      phone: $phone
    ) {
      mail_id
      first_name
      last_name
      is_doctor
      phone
      gender
    }
  }
`;
export const onCreateDoctor = /* GraphQL */ `
  subscription OnCreateDoctor(
    $mail_id: String
    $years: Int
    $expertise: String
    $clinic_name: String
    $clinic_address: String
  ) {
    onCreateDoctor(
      mail_id: $mail_id
      years: $years
      expertise: $expertise
      clinic_name: $clinic_name
      clinic_address: $clinic_address
    ) {
      mail_id
      years
      expertise
      clinic_name
      clinic_address
      clinic_phone
      location
    }
  }
`;
export const onUpdateDoctor = /* GraphQL */ `
  subscription OnUpdateDoctor(
    $mail_id: String
    $years: Int
    $expertise: String
    $clinic_name: String
    $clinic_address: String
  ) {
    onUpdateDoctor(
      mail_id: $mail_id
      years: $years
      expertise: $expertise
      clinic_name: $clinic_name
      clinic_address: $clinic_address
    ) {
      mail_id
      years
      expertise
      clinic_name
      clinic_address
      clinic_phone
      location
    }
  }
`;
export const onDeleteDoctor = /* GraphQL */ `
  subscription OnDeleteDoctor(
    $mail_id: String
    $years: Int
    $expertise: String
    $clinic_name: String
    $clinic_address: String
  ) {
    onDeleteDoctor(
      mail_id: $mail_id
      years: $years
      expertise: $expertise
      clinic_name: $clinic_name
      clinic_address: $clinic_address
    ) {
      mail_id
      years
      expertise
      clinic_name
      clinic_address
      clinic_phone
      location
    }
  }
`;
