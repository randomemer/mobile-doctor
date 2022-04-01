/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getRs = /* GraphQL */ `
  query GetRs($mail_id: String!) {
    getRs(mail_id: $mail_id) {
      mail_id
      timestamp
      bucketpath_recording
      bucketpath_denoised
      pulse
      user_doctor
    }
  }
`;
export const getRecording = /* GraphQL */ `
  query GetRecording($mail_id: String!, $timestamp: String!) {
    getRecording(mail_id: $mail_id, timestamp: $timestamp) {
      mail_id
      timestamp
      bucketpath_recording
      bucketpath_denoised
      pulse
      user_doctor
    }
  }
`;
export const listRecordings = /* GraphQL */ `
  query ListRecordings(
    $filter: TableRecordingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRecordings(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        mail_id
        timestamp
        bucketpath_recording
        bucketpath_denoised
        pulse
        user_doctor
      }
      nextToken
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($mail_id: String!) {
    getUser(mail_id: $mail_id) {
      mail_id
      first_name
      last_name
      is_doctor
      phone
      gender
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: TableUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        mail_id
        first_name
        last_name
        is_doctor
        phone
        gender
      }
      nextToken
    }
  }
`;
export const getDoctor = /* GraphQL */ `
  query GetDoctor($mail_id: String!) {
    getDoctor(mail_id: $mail_id) {
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
export const listDoctors = /* GraphQL */ `
  query ListDoctors(
    $filter: TableDoctorFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDoctors(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        mail_id
        years
        expertise
        clinic_name
        clinic_address
        clinic_phone
        location
      }
      nextToken
    }
  }
`;
