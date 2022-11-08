import { TailSpin } from "react-loader-spinner";

export function Spinner() {
  return (
    <div className="h-screen flex mt-20 justify-center">
      <TailSpin
        height="80"
        width="80"
        color="rgb(167 139 250)"
        ariaLabel="tail-spin-loading"
        radius="1"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </div>
  );
}
