import { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { State } from '../../../store/reducers';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../../../store';

// Typescript
import { UISettingsForm, ApiResponse, Config } from '../../../interfaces';

// UI
import { InputGroup, Button, SettingsHeadline } from '../../UI';

// Utils
import { uiSettingsTemplate, inputHandler, applyAuth } from '../../../utility';

export const UISettings = (): JSX.Element => {
  const { loading, config } = useSelector((state: State) => state.config);

  const dispatch = useDispatch();
  const { updateConfig, createNotification } = bindActionCreators(
    actionCreators,
    dispatch
  );

  const [formData, setFormData] = useState<UISettingsForm>(uiSettingsTemplate);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormData({
      ...config,
    });
    if (config.customLogo) {
      setLogoPreview(`/uploads/${config.customLogo}`);
    }
  }, [loading]);

  const formSubmitHandler = async (e: FormEvent) => {
    e.preventDefault();
    await updateConfig(formData);
    document.title = formData.customTitle;
  };

  const inputChangeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    options?: { isNumber?: boolean; isBool?: boolean }
  ) => {
    inputHandler<UISettingsForm>({
      e,
      options,
      setStateHandler: setFormData,
      state: formData,
    });
  };

  const logoFileChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
      setLogoPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const uploadLogoHandler = async () => {
    if (!logoFile) {
      createNotification({
        title: 'Error',
        message: 'Please select a file first',
      });
      return;
    }

    const formDataUpload = new FormData();
    formDataUpload.append('logo', logoFile);

    try {
      const res = await axios.post<ApiResponse<Config>>(
        '/api/config/0/logo',
        formDataUpload,
        {
          headers: {
            ...applyAuth(),
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setFormData({ ...formData, customLogo: res.data.data.customLogo });
      setLogoPreview(`/uploads/${res.data.data.customLogo}`);
      setLogoFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      createNotification({
        title: 'Success',
        message: 'Logo uploaded successfully',
      });

      dispatch({
        type: 'UPDATE_CONFIG',
        payload: res.data.data,
      });
    } catch (err) {
      console.log(err);
      createNotification({
        title: 'Error',
        message: 'Failed to upload logo',
      });
    }
  };

  const deleteLogoHandler = async () => {
    try {
      const res = await axios.delete<ApiResponse<Config>>(
        '/api/config/0/logo',
        {
          headers: applyAuth(),
        }
      );

      setFormData({ ...formData, customLogo: '' });
      setLogoPreview('');
      setLogoFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      createNotification({
        title: 'Success',
        message: 'Logo removed successfully',
      });

      dispatch({
        type: 'UPDATE_CONFIG',
        payload: res.data.data,
      });
    } catch (err) {
      console.log(err);
      createNotification({
        title: 'Error',
        message: 'Failed to remove logo',
      });
    }
  };

  return (
    <form onSubmit={(e) => formSubmitHandler(e)}>
      {/* === OTHER OPTIONS === */}
      <SettingsHeadline text="Miscellaneous" />
      {/* PAGE TITLE */}
      <InputGroup>
        <label htmlFor="customTitle">Custom page title</label>
        <input
          type="text"
          id="customTitle"
          name="customTitle"
          placeholder="Flame"
          value={formData.customTitle}
          onChange={(e) => inputChangeHandler(e)}
        />
      </InputGroup>

      {/* === LOGO OPTIONS === */}
      <SettingsHeadline text="Logo" />
      <InputGroup>
        <label htmlFor="logoUpload">Upload custom logo</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {logoPreview && (
            <div>
              <img
                src={logoPreview}
                alt="Logo preview"
                style={{
                  maxWidth: '120px',
                  maxHeight: '120px',
                  objectFit: 'contain',
                  borderRadius: '8px',
                  border: '1px solid var(--color-primary)',
                  padding: '5px',
                }}
              />
            </div>
          )}
          <input
            type="file"
            id="logoUpload"
            accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/x-icon"
            onChange={logoFileChangeHandler}
            ref={fileInputRef}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button click={uploadLogoHandler}>
              Upload logo
            </Button>
            {formData.customLogo && (
              <Button click={deleteLogoHandler}>
                Remove logo
              </Button>
            )}
          </div>
        </div>
      </InputGroup>

      {/* === SEARCH OPTIONS === */}
      <SettingsHeadline text="Search" />
      {/* HIDE SEARCHBAR */}
      <InputGroup>
        <label htmlFor="hideSearch">Hide search bar</label>
        <select
          id="hideSearch"
          name="hideSearch"
          value={formData.hideSearch ? 1 : 0}
          onChange={(e) => inputChangeHandler(e, { isBool: true })}
        >
          <option value={1}>True</option>
          <option value={0}>False</option>
        </select>
      </InputGroup>

      {/* AUTOFOCUS SEARCHBAR */}
      <InputGroup>
        <label htmlFor="disableAutofocus">Disable search bar autofocus</label>
        <select
          id="disableAutofocus"
          name="disableAutofocus"
          value={formData.disableAutofocus ? 1 : 0}
          onChange={(e) => inputChangeHandler(e, { isBool: true })}
        >
          <option value={1}>True</option>
          <option value={0}>False</option>
        </select>
      </InputGroup>

      {/* === HEADER OPTIONS === */}
      <SettingsHeadline text="Header" />
      {/* HIDE HEADER */}
      <InputGroup>
        <label htmlFor="hideHeader">
          Hide headline (greetings and weather)
        </label>
        <select
          id="hideHeader"
          name="hideHeader"
          value={formData.hideHeader ? 1 : 0}
          onChange={(e) => inputChangeHandler(e, { isBool: true })}
        >
          <option value={1}>True</option>
          <option value={0}>False</option>
        </select>
      </InputGroup>

      {/* HIDE DATE */}
      <InputGroup>
        <label htmlFor="hideDate">Hide date</label>
        <select
          id="hideDate"
          name="hideDate"
          value={formData.hideDate ? 1 : 0}
          onChange={(e) => inputChangeHandler(e, { isBool: true })}
        >
          <option value={1}>True</option>
          <option value={0}>False</option>
        </select>
      </InputGroup>

      {/* HIDE TIME */}
      <InputGroup>
        <label htmlFor="showTime">Hide time</label>
        <select
          id="showTime"
          name="showTime"
          value={formData.showTime ? 1 : 0}
          onChange={(e) => inputChangeHandler(e, { isBool: true })}
        >
          <option value={0}>True</option>
          <option value={1}>False</option>
        </select>
      </InputGroup>

      {/* DATE FORMAT */}
      <InputGroup>
        <label htmlFor="useAmericanDate">Date formatting</label>
        <select
          id="useAmericanDate"
          name="useAmericanDate"
          value={formData.useAmericanDate ? 1 : 0}
          onChange={(e) => inputChangeHandler(e, { isBool: true })}
        >
          <option value={1}>Friday, October 22 2021</option>
          <option value={0}>Friday, 22 October 2021</option>
        </select>
      </InputGroup>

      {/* CUSTOM GREETINGS */}
      <InputGroup>
        <label htmlFor="greetingsSchema">Custom greetings</label>
        <input
          type="text"
          id="greetingsSchema"
          name="greetingsSchema"
          placeholder="Good day;Hi;Bye!"
          value={formData.greetingsSchema}
          onChange={(e) => inputChangeHandler(e)}
        />
        <span>
          Greetings must be separated with semicolon. All 4 messages must be
          filled, even if they are the same
        </span>
      </InputGroup>

      {/* CUSTOM DAYS */}
      <InputGroup>
        <label htmlFor="daySchema">Custom weekday names</label>
        <input
          type="text"
          id="daySchema"
          name="daySchema"
          placeholder="Sunday;Monday;Tuesday"
          value={formData.daySchema}
          onChange={(e) => inputChangeHandler(e)}
        />
        <span>Names must be separated with semicolon</span>
      </InputGroup>

      {/* CUSTOM MONTHS */}
      <InputGroup>
        <label htmlFor="monthSchema">Custom month names</label>
        <input
          type="text"
          id="monthSchema"
          name="monthSchema"
          placeholder="January;February;March"
          value={formData.monthSchema}
          onChange={(e) => inputChangeHandler(e)}
        />
        <span>Names must be separated with semicolon</span>
      </InputGroup>

      {/* === SECTIONS OPTIONS === */}
      <SettingsHeadline text="Sections" />
      {/* HIDE APPS */}
      <InputGroup>
        <label htmlFor="hideApps">Hide applications</label>
        <select
          id="hideApps"
          name="hideApps"
          value={formData.hideApps ? 1 : 0}
          onChange={(e) => inputChangeHandler(e, { isBool: true })}
        >
          <option value={1}>True</option>
          <option value={0}>False</option>
        </select>
      </InputGroup>

      {/* HIDE BOOKMARK CATEGORIES */}
      <InputGroup>
        <label htmlFor="hideCategories">Hide bookmarks</label>
        <select
          id="hideCategories"
          name="hideCategories"
          value={formData.hideCategories ? 1 : 0}
          onChange={(e) => inputChangeHandler(e, { isBool: true })}
        >
          <option value={1}>True</option>
          <option value={0}>False</option>
        </select>
      </InputGroup>

      <Button>Save changes</Button>
    </form>
  );
};
