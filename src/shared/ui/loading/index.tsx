import { Wrapper } from "../Wrapper"

interface Props {
    isLoading: boolean
    isError: boolean
}

export const Loading = ({isError, isLoading}:Props) => {
    return (
        <Wrapper>
            {isLoading && <div>Загрузка...</div>}
            {isError && <div>Произошла ошибка</div>}
        </Wrapper>
    )
}