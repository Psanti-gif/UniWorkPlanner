package edu.itm.gestorPendientes.utilities;


import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;


public class Conexion {

    Connection con;

    public Connection obtenerConexion() {
        try {
            con = DriverManager.getConnection("jdbc:mysql://localhost:3306/gestor_pendientes", "root", "");
        } catch (SQLException ex) {
            Logger.getLogger(Conexion.class.getName()).log(Level.SEVERE, null, ex);
            System.out.println(ex);
            ex.printStackTrace();
        }
        return con;
    }

    public static void main(String[] args) {
        Conexion conection = new Conexion();
        try {
            Connection c = conection.obtenerConexion();
            if (c != null) {
                System.out.println("CONEXION EXITOSA A LA BASE DE DATOS gestor_pendientes");
                c.close();
            } else {
                System.out.println("NO SE PUDO CONECTAR A LA BASE DE DATOS");
            }
        } catch (Exception e) {
            System.out.println("#Excepcion: " + e.getMessage());
        }
    }
}
