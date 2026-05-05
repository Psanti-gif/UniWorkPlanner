package edu.itm.gestorPendientes.repositoriesSQL;

import edu.itm.gestorPendientes.identidadesSQL.Tarea;
import edu.itm.gestorPendientes.utilities.Conexion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Repository
@Qualifier("repositorioSQL")
public class TareaRepositorySQL implements ITareaRepository {

    @Autowired
    private TareaRepositoryHelper tareaRepositoryHelper;

    @Override
    public List<Tarea> getTareas() {
        List<Tarea> result = new ArrayList<>();
        Conexion conexion = new Conexion();
        Connection connection = conexion.obtenerConexion();
        PreparedStatement preparedStatement = null;
        try {
            preparedStatement = connection.prepareStatement(tareaRepositoryHelper.listarTareas());
            ResultSet resultSet = preparedStatement.executeQuery();
            while (resultSet.next()) {
                Tarea tarea = new Tarea();
                tarea.setIdTarea(resultSet.getInt("idTarea"));
                tarea.setTitulo(resultSet.getString("titulo"));
                tarea.setDescripcion(resultSet.getString("descripcion"));
                tarea.setFechaCreacion(resultSet.getDate("fecha_creacion"));
                tarea.setFechaVencimiento(resultSet.getDate("fecha_vencimiento"));
                tarea.setPrioridad(resultSet.getString("prioridad"));
                tarea.setEstado(resultSet.getString("estado"));
                tarea.setCategoria(resultSet.getString("categoria"));
                result.add(tarea);
            }
        } catch (SQLException exception) {
            exception.printStackTrace();
        } finally {
            try {
                connection.close();
                preparedStatement.close();
            } catch (SQLException exc) {
                exc.printStackTrace();
            } catch (Exception ladenull) {
            }
        }
        return result;
    }

    @Override
    public Tarea getTareaPorId(Integer id) {
        Tarea tarea = null;
        Conexion conexion = new Conexion();
        Connection connection = conexion.obtenerConexion();
        PreparedStatement preparedStatement = null;
        try {
            preparedStatement = connection.prepareStatement(tareaRepositoryHelper.obtenerTareaPorId());
            preparedStatement.setInt(1, id);
            ResultSet resultSet = preparedStatement.executeQuery();
            if (resultSet.next()) {
                tarea = new Tarea();
                tarea.setIdTarea(resultSet.getInt("idTarea"));
                tarea.setTitulo(resultSet.getString("titulo"));
                tarea.setDescripcion(resultSet.getString("descripcion"));
                tarea.setFechaCreacion(resultSet.getDate("fecha_creacion"));
                tarea.setFechaVencimiento(resultSet.getDate("fecha_vencimiento"));
                tarea.setPrioridad(resultSet.getString("prioridad"));
                tarea.setEstado(resultSet.getString("estado"));
                tarea.setCategoria(resultSet.getString("categoria"));
            }
        } catch (SQLException exception) {
            exception.printStackTrace();
        } finally {
            try {
                connection.close();
                preparedStatement.close();
            } catch (SQLException exc) {
                exc.printStackTrace();
            } catch (Exception ladenull) {
            }
        }
        return tarea;
    }

    @Override
    public Tarea insertarTarea(Tarea tarea) {
        Conexion conexion = new Conexion();
        Connection connection = conexion.obtenerConexion();
        PreparedStatement preparedStatement = null;
        try {
            preparedStatement = connection.prepareStatement(tareaRepositoryHelper.insertarTarea());
            preparedStatement.setString(1, tarea.getTitulo());
            preparedStatement.setString(2, tarea.getDescripcion());

            if (tarea.getFechaVencimiento() != null) {
                preparedStatement.setDate(3, new java.sql.Date(tarea.getFechaVencimiento().getTime()));
            } else {
                preparedStatement.setNull(3, java.sql.Types.DATE);
            }

            preparedStatement.setString(4, tarea.getPrioridad() != null ? tarea.getPrioridad() : "MEDIA");
            preparedStatement.setString(5, tarea.getEstado() != null ? tarea.getEstado() : "PENDIENTE");
            preparedStatement.setString(6, tarea.getCategoria() != null ? tarea.getCategoria() : "PERSONAL");

            preparedStatement.execute();
        } catch (SQLException sqlException) {
            tarea = null;
            sqlException.printStackTrace();
        } finally {
            try {
                connection.close();
                preparedStatement.close();
            } catch (Exception exception) {
                exception.printStackTrace();
            }
        }
        return tarea;
    }

    @Override
    public Tarea actualizarTarea(Tarea tarea) {
        Conexion conexion = new Conexion();
        Connection connection = conexion.obtenerConexion();
        PreparedStatement preparedStatement = null;
        try {
            preparedStatement = connection.prepareStatement(tareaRepositoryHelper.actualizarTarea());
            preparedStatement.setString(1, tarea.getTitulo());
            preparedStatement.setString(2, tarea.getDescripcion());

            if (tarea.getFechaVencimiento() != null) {
                preparedStatement.setDate(3, new java.sql.Date(tarea.getFechaVencimiento().getTime()));
            } else {
                preparedStatement.setNull(3, java.sql.Types.DATE);
            }

            preparedStatement.setString(4, tarea.getPrioridad());
            preparedStatement.setString(5, tarea.getEstado());
            preparedStatement.setString(6, tarea.getCategoria());
            preparedStatement.setInt(7, tarea.getIdTarea());

            preparedStatement.executeUpdate();
        } catch (SQLException sqlException) {
            tarea = null;
            sqlException.printStackTrace();
        } finally {
            try {
                connection.close();
                preparedStatement.close();
            } catch (Exception exception) {
                exception.printStackTrace();
            }
        }
        return tarea;
    }

    @Override
    public boolean eliminarTarea(Integer id) {
        boolean eliminado = false;
        Conexion conexion = new Conexion();
        Connection connection = conexion.obtenerConexion();
        PreparedStatement preparedStatement = null;
        try {
            preparedStatement = connection.prepareStatement(tareaRepositoryHelper.eliminarTarea());
            preparedStatement.setInt(1, id);
            int filasAfectadas = preparedStatement.executeUpdate();
            eliminado = filasAfectadas > 0;
        } catch (SQLException sqlException) {
            sqlException.printStackTrace();
        } finally {
            try {
                connection.close();
                preparedStatement.close();
            } catch (Exception exception) {
                exception.printStackTrace();
            }
        }
        return eliminado;
    }
}
