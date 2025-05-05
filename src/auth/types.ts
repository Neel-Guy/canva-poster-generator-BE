export type tokenResponseData = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
};

export type templatesResponseData = {
  items:
    | [
        {
          id: string;
          title: string;
          view_url: string;
          create_url: string;
          thumbnail: [object];
          created_at: number;
          updated_at: number;
        },
      ]
    | [];
};
