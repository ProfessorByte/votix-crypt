import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { useAuth } from "../hooks/useAuth";
import { useCurrentElection } from "../hooks/useCurrentElection";

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const Results = () => {
  const { user, logout } = useAuth();
  const { currentElection } = useCurrentElection();

  return (
    <>
      <Header user={user} logout={logout} />
      {currentElection ? (
        <div className="container">
          <h2 className="mt-3">Resultados electorales</h2>
          <section>
            <ResponsiveContainer width="100%" height="100%" aspect={1.2}>
              <BarChart
                width={500}
                height={300}
                data={currentElection.results}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {Object.keys(currentElection.results[0])
                  .filter((key) => key !== "name")
                  .map((candidate) => (
                    <Bar
                      key={candidate}
                      dataKey={candidate}
                      stackId="a"
                      fill={getRandomColor()}
                    />
                  ))}
              </BarChart>
            </ResponsiveContainer>
          </section>
          <section className="mt-3 mb-5">
            <h2>Conteo total</h2>
            <table className="table table-dark table-striped">
              <thead>
                <tr>
                  <th scope="col">Candidato</th>
                  <th scope="col">Cantidad de votos</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(currentElection.results[0])
                  .filter((key) => key !== "name")
                  .map((candidate) => (
                    <tr key={candidate}>
                      <th scope="row">{candidate}</th>
                      <td>
                        {currentElection.results
                          .map((resDep) => resDep[candidate])
                          .reduce((acc, current) => acc + current, 0)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </section>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};
