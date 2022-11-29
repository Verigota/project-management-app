import { Button, Grid, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ICreateTaskParamResp, ICreateTaskReq } from '../../api/models/task';
import CloseRoundedButton from '../../components/CloseRoundedButton';
import { FormTranslationKeys, LocalStorageKeys } from '../../enums';
import useAppDispatch from '../../hooks/useAppDispatch';
import { closeModal, createTask, showLoader, hideLoader } from '../../redux/newTaskSlice';
import { openToast, RespRes } from '../../redux/toastSlice';
import { TranslationKeys as ToastTranslations } from '../Toast/enum';
import DefaultSelect from './DefaultSelect';
import { TranslationKeys } from './enum';

interface Props {
  columnId: string;
  boardId: string;
}

const Form = (props: Props) => {
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors }
  } = useForm<ICreateTaskParamResp>({
    defaultValues: {
      title: '',
      order: 0,
      description: '',
      userId: '',
      users: []
    }
  });

  const { requiredE } = FormTranslationKeys;
  const { title, users, createBtn, description } = TranslationKeys;
  const { successCreateTask, fail } = ToastTranslations;

  const { t } = useTranslation([TranslationKeys.ns, FormTranslationKeys.ns, ToastTranslations.ns]);

  const onSubmit = async () => {
    const userId = localStorage.getItem(LocalStorageKeys.userId);

    if (userId) {
      const { title, description, users } = getValues();
      const params: ICreateTaskReq = {
        data: { title, order: 0, description, userId: userId, users: [...users] }, //TODO Need to replace order with tasks quantity in the column
        columnId: props.columnId,
        boardId: props.boardId
      };
      try {
        dispatch(showLoader());
        await dispatch(createTask(params)).unwrap();
        dispatch(
          openToast({
            message: t(successCreateTask, { ns: ToastTranslations.ns }),
            type: RespRes.success
          })
        );
      } catch (e) {
        const eMessage = t(fail, { ns: ToastTranslations.ns });
        dispatch(openToast({ message: eMessage, type: RespRes.error }));
      } finally {
        dispatch(closeModal());
        dispatch(hideLoader());
      }
    }
  };

  const onClick = () => dispatch(closeModal());

  return (
    <>
      <Grid
        container
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        flexDirection="column"
        alignItems="center"
        gap={3}>
        <TextField
          id="title"
          label={t(title)}
          variant="outlined"
          required
          type="text"
          fullWidth
          error={!!errors.title}
          helperText={t(errors.title?.message || '', FormTranslationKeys)}
          {...register(title, {
            required: { value: true, message: requiredE }
          })}
        />
        <TextField
          id="description"
          label={t(description)}
          variant="outlined"
          required
          type="text"
          fullWidth
          error={!!errors.description}
          helperText={t(errors.description?.message || '', FormTranslationKeys)}
          {...register(description, {
            required: { value: true, message: requiredE }
          })}
        />
        <DefaultSelect {...register(users)} />
        <Button type="submit" variant="contained" fullWidth sx={{ maxWidth: '25ch' }}>
          {t(createBtn)}
        </Button>
      </Grid>
      <CloseRoundedButton onClick={onClick} />
    </>
  );
};

export default Form;
