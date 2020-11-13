export type OauthConfig = {
  client_id: string;
  redirect_uri: string;
  scope: string;
  response_type: 'code';
  state: string;
};
