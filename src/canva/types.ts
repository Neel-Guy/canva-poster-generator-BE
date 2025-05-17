export type fileUploadTypes = {
  job: {
    id: string;
    status: string;
    asset?: ImageAssetTypes;
  };
  error?: AssetUploadErrorTypes;
};

export type ImageAssetTypes = {
  id: string;
  name: string;
  tags: string[];
  created_at: number;
  updated_at: number;
  thumbnail: {
    url: string;
    width: number;
    height: number;
  };
};
export type AssetUploadErrorTypes = {
  code: string;
  message: string;
};

export type AutoFillJobResponseTypes = {
  job: {
    id: string;
    status: string;
    result: {
      type: string;
      design: {
        id: string;
        title: string;
        url: string;
        thumbnail: {
          width: number;
          height: number;
          url: string;
        };
      };
    };
  };
};
