/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createRecording = /* GraphQL */ `
  mutation CreateRecording($input: CreateRecordingInput!) {
    createRecording(input: $input) {
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
export const updateRecording = /* GraphQL */ `
  mutation UpdateRecording($input: UpdateRecordingInput!) {
    updateRecording(input: $input) {
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
export const deleteRecording = /* GraphQL */ `
  mutation DeleteRecording($input: DeleteRecordingInput!) {
    deleteRecording(input: $input) {
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
export const createUser = /* GraphQL */ `
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      mail_id
      first_name
      last_name
      is_doctor
      phone
      gender
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      mail_id
      first_name
      last_name
      is_doctor
      phone
      gender
    }
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser($input: DeleteUserInput!) {
    deleteUser(input: $input) {
      mail_id
      first_name
      last_name
      is_doctor
      phone
      gender
    }
  }
`;
export const createDoctor = /* GraphQL */ `
  mutation CreateDoctor($input: CreateDoctorInput!) {
    createDoctor(input: $input) {
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
export const updateDoctor = /* GraphQL */ `
  mutation UpdateDoctor($input: UpdateDoctorInput!) {
    updateDoctor(input: $input) {
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
export const deleteDoctor = /* GraphQL */ `
  mutation DeleteDoctor($input: DeleteDoctorInput!) {
    deleteDoctor(input: $input) {
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
