import React, { useMemo, useState } from 'react';
import { Image, Modal, Space, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import getBase64 from 'getbase64data';
import { useTranslation } from 'react-i18next';
import { UploadOutlined } from '@ant-design/icons';

import { isArray } from 'helpers/transform';

export interface IUploadInput {
  parentId: string;
  value?: any;
  defaultValue?: any;
  onChange?: (value: any) => void;
  multiple?: boolean;
}

export const UploadInput: React.FC<IUploadInput> = ({
  parentId,
  value,
  onChange,
  multiple,
  ...props
}) => {
  const { t: _t } = useTranslation('UploadInput');
  const [previewFileUrl, setPreviewFileUrl] = useState<string | undefined>();

  const onUpload = async (info: any) => {
    const changedFileList = multiple ? info.fileList : info.fileList.slice(-1);
    const base64List: string[] = [];
    for (const file of changedFileList) {
      if (file.originFileObj) {
        const content = await getBase64.fromFile(file.originFileObj);
        base64List.push(content);
      } else {
        base64List.push(file.url);
      }
    }
    if (multiple) {
      if (onChange) onChange(base64List);
    } else {
      if (onChange) onChange(base64List[0]);
    }
  };

  const defaultFileList = useMemo(() => {
    if (!value) return undefined;
    const v = isArray(value) ? value : [value];
    return v.map((url: string, index: number) => {
      return {
        uid: index,
        status: 'done',
        url,
      };
    });
  }, [value]);

  const onPreview = async (file: any) => {
    setPreviewFileUrl(file.url ? file.url : await getBase64.fromFile(file.originFileObj));
  };

  const onClosePreview = () => setPreviewFileUrl(undefined);

  const beforeUpload = () => false;

  return (
    <>
      <ImgCrop rotationSlider={true}>
        <Upload
          listType="picture-card"
          withCredentials={true}
          beforeUpload={beforeUpload}
          onChange={onUpload}
          defaultFileList={defaultFileList}
          multiple={multiple}
          onPreview={onPreview}
          {...props}
        >
          <Space>
            <UploadOutlined />
            {_t('Upload')}
          </Space>
        </Upload>
      </ImgCrop>
      <Modal
        footer={null}
        title={_t('Preview Image')}
        open={!!previewFileUrl}
        onCancel={onClosePreview}
      >
        <Image preview={false} src={previewFileUrl} />
      </Modal>
    </>
  );
};
